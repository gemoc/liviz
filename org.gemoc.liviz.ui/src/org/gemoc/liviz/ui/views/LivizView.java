/*******************************************************************************
 * Copyright (c) 2016, 2017 Inria and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *     Inria - initial API and implementation
 *******************************************************************************/
package org.gemoc.liviz.ui.views;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.eclipse.emf.ecore.EAttribute;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EStructuralFeature;
import org.eclipse.gemoc.executionframework.ui.views.engine.EngineSelectionDependentViewPart;
import org.eclipse.gemoc.trace.commons.model.generictrace.GenericAttributeValue;
import org.eclipse.gemoc.trace.commons.model.generictrace.GenericValue;
import org.eclipse.gemoc.trace.commons.model.generictrace.SingleReferenceValue;
import org.eclipse.gemoc.trace.commons.model.trace.Dimension;
import org.eclipse.gemoc.trace.commons.model.trace.State;
import org.eclipse.gemoc.trace.commons.model.trace.Step;
import org.eclipse.gemoc.trace.commons.model.trace.TracedObject;
import org.eclipse.gemoc.trace.commons.model.trace.Value;
import org.eclipse.gemoc.trace.gemoc.api.IMultiDimensionalTraceAddon;
import org.eclipse.gemoc.trace.gemoc.api.ITraceExtractor;
import org.eclipse.gemoc.trace.gemoc.api.ITraceListener;
import org.eclipse.gemoc.trace.gemoc.api.ITraceNotifier;
import org.eclipse.gemoc.xdsmlframework.api.core.IExecutionEngine;
import org.eclipse.swt.SWT;
import org.eclipse.swt.events.SelectionAdapter;
import org.eclipse.swt.events.SelectionEvent;
import org.eclipse.swt.graphics.RGB;
import org.eclipse.swt.layout.GridLayout;
import org.eclipse.swt.widgets.Button;
import org.eclipse.swt.widgets.ColorDialog;
import org.eclipse.swt.widgets.Combo;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.jface.preference.ColorFieldEditor;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.Event;
import org.eclipse.swt.widgets.Group;
import org.eclipse.swt.widgets.Label;
import org.eclipse.swt.widgets.Listener;
import org.eclipse.swt.widgets.Shell;
import org.eclipse.ui.PlatformUI;
import org.gemoc.liviz.ui.network.WebApi;

public class LivizView extends EngineSelectionDependentViewPart
{

	public static final String ID = "org.gemoc.liviz.ui.views.LivizView";

	private IMultiDimensionalTraceAddon<Step<?>, State<?, ?>, TracedObject<?>, Dimension<?>, Value<?>> traceAddon;

	private List<String> variables = new ArrayList<String>();

	private List<String> selectedVariables = new ArrayList<String>();
	
	private List<Button> variableButtons = new ArrayList<Button>();


	private int stepId = 0;

	private Group group;

	private Composite root;

	@Override
	public void dispose()
	{
		super.dispose();

	}

	@Override
	public void createPartControl(Composite parent)
	{
		this.root = parent;

		GridLayout gridLayout = new GridLayout();

		gridLayout.numColumns = 3;

		this.group = new Group(parent, SWT.SHADOW_ETCHED_IN);
		group.setLocation(25, 25);
		group.setLayout(gridLayout);

		group.setText("Liviz");

		new Label(group, SWT.None).setText("Variable name");

		new Label(group, SWT.None).setText("Color");

		new Label(group, SWT.None).setText("X Axis");

		Button button = new Button(parent, SWT.PUSH);
		button.addListener(SWT.Selection, new Listener()
		{
			@Override
			public void handleEvent(Event event)
			{
				StringBuilder builder = new StringBuilder();

				String prefix = "";

				for (Button checkbox : variableButtons)
				{
					String variableName = checkbox.getText();

					if (checkbox.getSelection())
					{
						builder.append(prefix);
						builder.append("\"" + variableName + "\"");
						prefix = ",";

						selectedVariables.add(variableName);
					}
				}

				try
				{
					var configuration = "{\"graphs\":[{\"variables\":[" + builder.toString()
							+ "],\"window\":\"0\",\"name\":\"myGraph\",\"x\":\"step\",\"type\":\"points\"}]}";

					WebApi.putConfiguration(configuration);

					System.out.println("Send : " + configuration);
				} catch (IOException e)
				{

					e.printStackTrace();
				}
			}
		});

		button.setText("Update configuration");

	}

	private void clearVariables()
	{
		// todo, swt sucks

	}

	private void displayVariables()
	{
		System.out.println(variables.size() + " variables to draw");
		// TableEditor[] colorEditors = new TableEditor[variables.size()];

		for (int i = 0; i < variables.size(); i++)
		{

			Button check = new Button(group, SWT.CHECK);
			check.setText(variables.get(i));
			variableButtons.add(check);

			Button colorButton = new Button(group, SWT.PUSH);
			colorButton.setText("Update");

			colorButton.addSelectionListener(new SelectionAdapter()
			{
				public void widgetSelected(SelectionEvent event)
				{
					var shell = PlatformUI.getWorkbench().getActiveWorkbenchWindow().getShell();
					ColorDialog dlg = new ColorDialog(shell);
					dlg.setText("Choose a Color");
					RGB rgb = dlg.open();

				}
			});
			
			
			

			Combo combo = new Combo(group, SWT.READ_ONLY);

			ArrayList<String> items = new ArrayList<String>();

			items.add("Debugger steps");

			combo.setText("Debugger steps");

			for (int j = 0; j < variables.size(); j++)
			{
				if (i != j)
				{
					items.add(variables.get(j));
				}
			}

			combo.setItems(items.toArray(new String[0]));

			combo.select(0);
			
		

		}

		group.pack();

	}

	@Override
	public void setFocus()
	{

	}

	private Object getVariableValue(Value<?> value)
	{
		final String attributeName;

		if (value instanceof GenericValue)
		{
			if (value instanceof GenericAttributeValue)
			{
				attributeName = "attributeValue";
			} else if (value instanceof SingleReferenceValue)
			{
				attributeName = "referenceValue";
			} else
			{
				attributeName = "referenceValues";
			}
		} else
		{
			attributeName = "";
		}

		if (attributeName.length() > 0)
		{
			final Optional<EStructuralFeature> attribute = value.eClass().getEAllStructuralFeatures().stream()
					.filter(r -> r.getName().equals(attributeName)).findFirst();

			if (attribute.isPresent())
			{
				EObject o = (EObject) value.eGet(attribute.get());

				return o.eClass().getEStructuralFeatures().stream().filter(x -> x instanceof EAttribute).findFirst()
						.map(x -> (EAttribute) x).map(x -> o.eGet(x)).orElse(null);

			}
		}

		return null;
	}

	@Override
	public void engineSelectionChanged(IExecutionEngine<?> engine)
	{
		stepId = 0;

		Display.getDefault().asyncExec(new Runnable()
		{
			public void run()
			{
				clearVariables();
			}
		});

		System.out.println("Engine selection changed !");

		if (engine != null)
		{
			@SuppressWarnings("rawtypes")
			Set<IMultiDimensionalTraceAddon> traceAddons = engine.getAddonsTypedBy(IMultiDimensionalTraceAddon.class);

			if (!traceAddons.isEmpty())
			{
				@SuppressWarnings("unchecked")
				final IMultiDimensionalTraceAddon<Step<?>, State<?, ?>, TracedObject<?>, Dimension<?>, Value<?>> traceAddon = traceAddons
						.iterator().next();

				final ITraceNotifier notifier = traceAddon.getTraceNotifier();

				final ITraceExtractor<Step<?>, State<?, ?>, TracedObject<?>, Dimension<?>, Value<?>> traceExtractor = traceAddon
						.getTraceExtractor();

				notifier.addListener(new ITraceListener()
				{
					@Override
					public void valuesAdded(List<Value<?>> values)
					{

						System.out.println("Values added event. ( " + selectedVariables.size() + " variables");

						for (Value<?> value : values)
						{

							String refers = traceExtractor.getDimensionLabel((Dimension<?>) value.eContainer());

							if (selectedVariables.contains(refers))
							{

								String raw = "# " + refers + " step\n";
								raw += getVariableValue(value) + " " + stepId;

								try
								{
									WebApi.putValues(raw);
								} catch (IOException e)
								{

									e.printStackTrace();
								}

							}

						}
					}

					@Override
					public void stepsStarted(List<Step<?>> steps)
					{
						stepId++;
					}

					@Override
					public void stepsEnded(List<Step<?>> steps)
					{
					}

					@Override
					public void statesAdded(List<State<?, ?>> states)
					{
					}

					@Override
					public void dimensionsAdded(List<Dimension<?>> dimensions)
					{

					

						for (Dimension<?> dimension : dimensions)
						{
							variables.add(traceExtractor.getDimensionLabel(dimension));
						}

						Display.getDefault().asyncExec(new Runnable()
						{
							public void run()
							{
								displayVariables();
							}
						});
					}
				});

				this.traceAddon = traceAddon;

			}

		}
	}

}
